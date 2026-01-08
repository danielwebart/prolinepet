function Error({ statusCode }: { statusCode: number }) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Erro {statusCode}</h1>
      <p>
        {statusCode
          ? `Ocorreu um erro ${statusCode} no servidor`
          : 'Ocorreu um erro no cliente'}
      </p>
    </div>
  )
}
 
Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
 
export default Error
