export default function access(initialState: { currentUser?: User.UserInfo } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.userRole === 'admin',
  };
}
