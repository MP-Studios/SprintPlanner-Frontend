import { TimerProvider } from './timer/TimerContext';

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TimerProvider>
      {children}
    </TimerProvider>
  );
}
