export default function Loading({ message = "Finding delicious recipes..." }) {
  return (
    <div className="loading">
      <span className="loading-spinner">🍳</span>
      <p>{message}</p>
    </div>
  );
}