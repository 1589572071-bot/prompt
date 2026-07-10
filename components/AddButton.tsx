interface AddButtonProps {
  label: string;
  onClick?: () => void;
}

export function AddButton({ label, onClick }: AddButtonProps) {
  return (
    <button
      aria-label={label}
      className="button icon-add-button"
      onClick={onClick}
      title={label}
      type="button"
    >
      +
    </button>
  );
}
