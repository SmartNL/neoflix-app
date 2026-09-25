export function Loader() {
  return <div className="loader" role="status" aria-label="Cargando" />
}

export function ErrorMessage({ message }: { message: string }) {
  return <p className="error-message">{message}</p>
}
