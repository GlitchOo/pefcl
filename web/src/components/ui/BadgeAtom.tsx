import { Badge, BadgeProps } from '@mui/material';
import { Atom, useAtom } from 'jotai';
import React, { ReactNode } from 'react';

interface BadgeAtomProps extends BadgeProps {
  children: ReactNode;
  countAtom: Atom<number | Promise<number>>;
}

const BadgeAtomContent = ({ countAtom, children, ...props }: BadgeAtomProps) => {
  const [amount] = useAtom(countAtom);

  return (
    <Badge color="error" badgeContent={amount} {...props}>
      {children}
    </Badge>
  );
};

const BadgeAtom = (props: BadgeAtomProps) => {
  const { children, countAtom, ...badgeProps } = props;
  void countAtom;
  return (
    <React.Suspense fallback={<Badge badgeContent={'..'} {...badgeProps}>{children}</Badge>}>
      <BadgeAtomContent {...props} />
    </React.Suspense>
  );
};

export default BadgeAtom;
