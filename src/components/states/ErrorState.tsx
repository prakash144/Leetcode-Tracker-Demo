interface ErrorStateProps {
  message: string;
}

const ErrorState = ({ message }: ErrorStateProps) => (
  <div className="text-center text-red-500">{message}</div>
);

export default ErrorState;
