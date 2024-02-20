/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};

  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    admin: () => {
      return currentUser?.role === 'ADMIN'
    },
    member: () => currentUser?.role !== 'ADMIN',
  };
}
