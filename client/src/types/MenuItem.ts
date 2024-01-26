// defining menu item interface
export interface MenuItem {
  id: string;
  title: string;
  path: string;
  icon?: JSX.Element;
  authRequired?: boolean;
}
