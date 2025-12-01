interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
}


export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 text-gray-600">
        {icon && <div className="mb-2">{icon}</div>}
        <p className="text-lg font-medium">{message}</p>
    </div>
);
}