export default function Loading({ message = "読み込み中..." }) {
  return <p className="text-center py-4 text-gray-600">{message}</p>;
}
