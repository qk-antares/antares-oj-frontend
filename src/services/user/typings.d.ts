declare namespace User {
  type UserInfo = {
    uid: number;
    username: string;
    userRole: string;
    accessKey: string;
    secretKey: string;
    tags: User.UserTag[];
    signature: string;
    email: string;
    phone: string;
    sex: number;
    avatar: string;
    follow: number;
    fans: number;
    topic: number;
    isFollow: boolean;
  };
}
