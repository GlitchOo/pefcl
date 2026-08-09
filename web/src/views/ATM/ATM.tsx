import Button from '@components/ui/Button';
import { Heading2, Heading4, Heading6 } from '@components/ui/Typography/Headings';
import styled from '@emotion/styled';
import { useConfig } from '@hooks/useConfig';
import { Alert, Paper, Stack } from '@mui/material';
import { Account, AtmInput, GetAtmAccountInput } from '@typings/Account';
import { AccountEvents, CardEvents } from '@typings/Events';
import { defaultWithdrawOptions } from '@utils/constants';
import { formatMoney } from '@utils/currency';
import { fetchNui } from '@utils/fetchNui';
import theme from '@utils/theme';
import { AnimatePresence } from 'motion/react';
import React, { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { useNuiEvent } from '@hooks/useNuiEvent';
import { Card, InventoryCard } from '@typings/BankCard';
import { useKeyDown } from '@hooks/useKeyPress';
import { CardErrors } from '@typings/Errors';
import { PIN_CODE_LENGTH } from '@shared/constants';
import BankCard from '@components/BankCard';
import { AccountBalanceRounded, ErrorRounded } from '@mui/icons-material';
import PinField from '@components/ui/Fields/PinField';
import { useExitListener } from '@hooks/useExitListener';
import { useAtomValue } from 'jotai';
import { defaultAccountAtom } from '@data/accounts';

const AnimationContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
`;

const Container = styled(Paper)`
  display: inline-block;
  min-width: 22rem;
  padding: 0;
  border-radius: var(--panel-radius);
  overflow: hidden;
  background: var(--bg-primary) !important;
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-panel), inset 0 1px 0 rgba(255, 255, 255, 0.04);
`;

const BrandBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(180deg, rgba(124, 181, 24, 0.12) 0%, transparent 100%),
    var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: linear-gradient(90deg, ${theme.palette.primary.main}, transparent 60%);
  }

  svg {
    color: ${theme.palette.primary.main};
    font-size: 1.15rem;
  }
`;

const BrandName = styled.span`
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.85rem;
`;

const BrandStep = styled.span`
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.palette.text.disabled};
`;

const Body = styled.div`
  padding: ${theme.spacing(4)} ${theme.spacing(5)} ${theme.spacing(5)};
`;

const AccountBalance = styled(Heading6)`
  color: ${theme.palette.text.secondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.7rem;
`;

const BalanceAmount = styled(Heading2)`
  font-variant-numeric: tabular-nums;
  margin-top: 0.25rem;
`;

const Header = styled(Stack)`
  margin-bottom: ${theme.spacing(3.5)};
`;

const StepTitle = styled(Heading4)`
  letter-spacing: 0.04em;
`;

const WithdrawText = styled(Heading6)`
  display: block;
  padding-bottom: ${theme.spacing(1.5)};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.palette.text.secondary};
  font-size: 0.7rem;
`;

const WithdrawContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 8.5rem);
  grid-row-gap: ${theme.spacing(1.25)};
  grid-column-gap: ${theme.spacing(1.25)};

  button {
    min-height: 3rem;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }
`;

const CardWrapper = styled.div`
  min-width: 16rem;
  transition: transform var(--transition-fast);

  :hover {
    transform: translateY(-2px);
  }
`;

const CardsRow = styled(Stack)`
  max-width: 52rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

type BankState = 'select-card' | 'enter-pin' | 'withdraw';

const Atm = () => {
  const { t } = useTranslation();
  const config = useConfig();
  const { isCardsEnabled } = config.frameworkIntegration;
  const defaultAccount = useAtomValue(defaultAccountAtom);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState<Account>();
  const [isOpen, setIsOpen] = useState(false);

  useNuiEvent('pefcl', 'setVisibleATM', (data) => setIsOpen(data as boolean));
  const initialStatus: BankState = isCardsEnabled ? 'select-card' : 'withdraw';

  const [selectedCard, setSelectedCard] = useState<InventoryCard>();
  const [cards, setCards] = useState<InventoryCard[]>([]);
  const [state, setState] = useState<BankState>(initialStatus);
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setPin('');
      setAccount(undefined);
      setSelectedCard(undefined);
      setState(initialStatus);
    }
  }, [isOpen, initialStatus]);

  useExitListener(state === 'withdraw' || state === initialStatus);

  const withdrawOptions = config?.atms?.withdrawOptions ?? defaultWithdrawOptions;

  const handleBack = () => {
    setError('');
    setPin('');
    if (state === 'enter-pin') {
      setState('select-card');
    } else if (state === 'withdraw' && isCardsEnabled) {
      setAccount(undefined);
      setSelectedCard(undefined);
      setState('select-card');
    }
  };

  useKeyDown(['Escape'], handleBack);

  useEffect(() => {
    const updateCards = async () => {
      try {
        const cards = await fetchNui<InventoryCard[]>(CardEvents.GetInventoryCards);
        if (!cards) {
          throw new Error('No cards available');
        }
        setCards(cards);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(t('Something went wrong, please try again later.'));
        }
      }
    };

    isCardsEnabled && isOpen && updateCards();
  }, [t, isCardsEnabled, isOpen]);

  const input = {
    cardId: selectedCard?.id ?? 0,
    pin: parseInt(pin, 10),
  };

  const handleUpdateBalance = async () => {
    setError('');
    const response = await fetchNui<{ account: Account; card: Card }, GetAtmAccountInput>(
      AccountEvents.GetAtmAccount,
      input,
    );

    if (!response) {
      return;
    }

    const { card, account } = response;
    setSelectedCard(card);
    setAccount(account);
  };

  const handleWithdraw = async (amount: number) => {
    const withdrawAccount = isCardsEnabled ? account : defaultAccount;
    if (!withdrawAccount) {
      return;
    }

    const accountId = withdrawAccount.id;

    const payload: AtmInput = isCardsEnabled
      ? {
          amount,
          cardId: selectedCard?.id,
          cardPin: parseInt(pin, 10),
          accountId,
          message: t('Withdrew {{amount}} from an ATM with card {{cardNumber}}.', {
            amount,
            cardNumber: selectedCard?.number ?? 'unknown',
          }),
        }
      : {
          amount,
          accountId,
          message: t('Withdrew {{amount}} from an ATM.', {
            amount,
          }),
        };

    setIsLoading(true);

    try {
      setError('');
      await fetchNui(AccountEvents.WithdrawMoney, payload);
      await handleUpdateBalance();
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === CardErrors.InvalidPin) {
          setError(t('Invalid pin'));
          return;
        }

        if (error.message === CardErrors.Blocked) {
          setError(t('The card is blocked'));
          return;
        }

        setError(error.message);
      } else {
        setError(t('Something went wrong, please try again later.'));
      }
    }

    setIsLoading(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!isCardsEnabled) {
      return;
    }

    if (pin.length === PIN_CODE_LENGTH && selectedCard?.id) {
      try {
        setError('');
        const response = await fetchNui<{ account: Account; card: Card }, GetAtmAccountInput>(
          AccountEvents.GetAtmAccount,
          input,
        );

        if (!response) {
          return;
        }

        const { card, account } = response;
        setSelectedCard(card);
        setAccount(account);
        setState('withdraw');
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === CardErrors.InvalidPin) {
            setError(t('Invalid pin'));
            return;
          }

          if (error.message === CardErrors.Blocked) {
            setError(t('The card is blocked'));
            return;
          }

          setError(error.message);
        } else {
          setError(t('Something went wrong, please try again later.'));
        }
      }
    }
  };

  const handleSelectCard = (card: InventoryCard) => {
    setSelectedCard(card);
    setState('enter-pin');
  };

  const accountBalance = isCardsEnabled ? account?.balance ?? 0 : defaultAccount?.balance ?? 0;

  const stepLabel =
    state === 'select-card' ? t('Select card') : state === 'enter-pin' ? t('Enter PIN') : t('Withdraw');

  const renderShell = (children: React.ReactNode) => (
    <Container elevation={4}>
      <BrandBar>
        <AccountBalanceRounded />
        <BrandName>Fleeca ATM</BrandName>
        <BrandStep>{stepLabel}</BrandStep>
      </BrandBar>
      <Body>{children}</Body>
    </Container>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && state === 'select-card' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              {renderShell(
                <>
                  <Header>
                    <StepTitle>{t('Select a card')}</StepTitle>
                    <Heading6>{t('Choose a debit card to continue')}</Heading6>
                  </Header>

                  <CardsRow direction="row" spacing={1.5}>
                    {cards.map((card) => (
                      <CardWrapper key={card.number} onClick={() => handleSelectCard(card)}>
                        <BankCard card={card} />
                      </CardWrapper>
                    ))}
                  </CardsRow>

                  {error && (
                    <Alert icon={<ErrorRounded />} color="error" sx={{ marginTop: '1rem' }}>
                      {error}
                    </Alert>
                  )}
                </>,
              )}
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && state === 'enter-pin' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              {renderShell(
                <>
                  <Header>
                    <StepTitle>{selectedCard?.number}</StepTitle>
                    <Heading6>{selectedCard?.holder}</Heading6>
                  </Header>

                  <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                      <PinField
                        label={t('Enter pin')}
                        value={pin}
                        onChange={(event) => setPin(event.target.value)}
                      />

                      <Button type="submit">{t('Enter pin')}</Button>
                    </Stack>
                  </form>

                  {error && (
                    <Alert icon={<ErrorRounded />} color="error" sx={{ marginTop: '1rem' }}>
                      {error}
                    </Alert>
                  )}
                </>,
              )}
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && state === 'withdraw' && (
          <AnimationContainer>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              {renderShell(
                <>
                  <Header>
                    <AccountBalance>{t('Account balance')}</AccountBalance>
                    <BalanceAmount>{formatMoney(accountBalance, config.general)}</BalanceAmount>
                    {isCardsEnabled && (
                      <Button
                        size="small"
                        variant="text"
                        onClick={handleBack}
                        sx={{ alignSelf: 'flex-start', marginTop: 1 }}
                      >
                        {t('Change card')}
                      </Button>
                    )}
                  </Header>

                  <WithdrawText>{t('Quick withdraw')}</WithdrawText>
                  <WithdrawContainer>
                    {withdrawOptions.map((value) => (
                      <Button
                        key={value}
                        onClick={() => handleWithdraw(value)}
                        data-value={value}
                        disabled={value > accountBalance || isLoading}
                      >
                        {formatMoney(value, config.general)}
                      </Button>
                    ))}
                  </WithdrawContainer>

                  {error && (
                    <Alert icon={<ErrorRounded />} color="error" sx={{ marginTop: '1rem' }}>
                      {error}
                    </Alert>
                  )}
                </>,
              )}
            </motion.div>
          </AnimationContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Atm;
