import { TransactionInput, TransactionType } from '@typings/Transaction';
import { mainLogger } from '@server/sv_logger';

const logger = mainLogger.child({ module: 'oxLogger' });

type BankLogMeta = {
  amount: number;
  type: TransactionType | string;
  reason?: string;
  fromAccountId?: number;
  toAccountId?: number;
  fromAccountNumber?: string;
  toAccountNumber?: string;
  fromOwner?: string;
  toOwner?: string;
  citizenid?: string;
  playerId?: number;
  invokingResource?: string;
  /** Primary account (actor) before/after balance snapshot */
  oldBalance?: number;
  newBalance?: number;
  fromOldBalance?: number;
  fromNewBalance?: number;
  toOldBalance?: number;
  toNewBalance?: number;
  [key: string]: unknown;
};

export type BalanceSnapshot = {
  oldBalance?: number;
  newBalance?: number;
  fromOldBalance?: number;
  fromNewBalance?: number;
  toOldBalance?: number;
  toNewBalance?: number;
};

const getResourceNameSafe = (): string => {
  try {
    return GetCurrentResourceName();
  } catch {
    return 'pefcl';
  }
};

const getInvokingResourceSafe = (): string | undefined => {
  try {
    const invoker = (globalThis as { GetInvokingResource?: () => string }).GetInvokingResource;
    return typeof invoker === 'function' ? invoker() : undefined;
  } catch {
    return undefined;
  }
};

/**
 * Account balances on the transaction input are expected to be POST-mutation.
 * Derive before/after from that + amount.
 */
const deriveBalances = (
  input: TransactionInput,
  override?: BalanceSnapshot,
): BalanceSnapshot => {
  if (override && (override.oldBalance != null || override.fromOldBalance != null || override.toOldBalance != null)) {
    return override;
  }

  const amount = input.amount;
  const fromBal = input.fromAccount?.balance;
  const toBal = input.toAccount?.balance;
  const result: BalanceSnapshot = {};

  if (typeof fromBal === 'number') {
    // from account was debited
    result.fromNewBalance = fromBal;
    result.fromOldBalance = fromBal + amount;
  }

  if (typeof toBal === 'number') {
    // to account was credited
    result.toNewBalance = toBal;
    result.toOldBalance = toBal - amount;
  }

  if (input.type === TransactionType.Outgoing || input.type === TransactionType.Transfer) {
    result.oldBalance = result.fromOldBalance;
    result.newBalance = result.fromNewBalance;
  } else if (input.type === TransactionType.Incoming) {
    result.oldBalance = result.toOldBalance;
    result.newBalance = result.toNewBalance;
  }

  return result;
};

/**
 * Send a banking event to ox_lib logger (via pecl Lua bridge).
 * Event name: `banking`.
 *
 * Uses a server event (not same-resource export) because FiveM JS cannot
 * reliably invoke its own Lua exports.
 */
export const logBanking = (
  source: number | string | undefined,
  message: string,
  metadata: BankLogMeta,
  level?: 'info' | 'warn' | 'error',
) => {
  try {
    const resource = getResourceNameSafe();
    const amount = metadata.amount ?? 0;
    const resolvedLevel = level ?? (amount >= 100000 ? 'warn' : 'info');
    const payload: BankLogMeta = {
      ...metadata,
      moneytype: 'bank',
      invokingResource: metadata.invokingResource ?? getInvokingResourceSafe() ?? resource,
    };

    emit('pefcl:internal:logBanking', source ?? -1, message, resolvedLevel, payload);
  } catch (err) {
    logger.error('Failed to send ox banking log');
    logger.error(err);
  }
};

export const logTransactionCreated = (
  source: number | undefined,
  input: TransactionInput,
  balances?: BalanceSnapshot,
) => {
  const from = input.fromAccount;
  const to = input.toAccount;
  const citizenid = from?.ownerIdentifier ?? to?.ownerIdentifier;
  const derived = deriveBalances(input, balances);

  const action =
    input.type === TransactionType.Transfer
      ? 'Bank transfer'
      : input.type === TransactionType.Incoming
        ? 'Bank credit'
        : 'Bank debit';

  logBanking(
    source && source > 0 ? source : citizenid,
    `${action}: ${input.message || 'Transaction'}`,
    {
      amount: input.amount,
      type: input.type,
      reason: input.message,
      fromAccountId: from?.id,
      toAccountId: to?.id,
      fromAccountNumber: from?.number,
      toAccountNumber: to?.number,
      fromOwner: from?.ownerIdentifier,
      toOwner: to?.ownerIdentifier,
      citizenid,
      playerId: source && source > 0 ? source : undefined,
      oldBalance: derived.oldBalance,
      newBalance: derived.newBalance,
      fromOldBalance: derived.fromOldBalance,
      fromNewBalance: derived.fromNewBalance,
      toOldBalance: derived.toOldBalance,
      toNewBalance: derived.toNewBalance,
    },
  );
};
