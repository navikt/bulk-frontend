export default function GetToken({ token }: { token: any }) {
  return JSON.stringify(token)
}

export async function getServerSideProps(ctx: any) {
  return { props: { token: ctx.req?.headers } }
}
