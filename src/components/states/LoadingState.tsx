interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="text-center text-gray-500">{message}</div>
);

export default LoadingState;
