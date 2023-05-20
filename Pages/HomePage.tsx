import * as React from 'react';
import SplashScreen from 'react-native-splash-screen';

const isOnTesting: boolean = false;
const defaultRedirectPage = isOnTesting ? 'Test' : 'Notification';

interface PropsInterface {
  navigation: any;
}
interface StateInterface {}

class HomePage extends React.Component<PropsInterface, StateInterface> {
  navigate: any;

  constructor(props: PropsInterface) {
    super(props);
    this.navigate = this.props.navigation.navigate;
  }

  componentDidMount(): void {
    SplashScreen.show();
    setTimeout(() => {
      SplashScreen.hide();
      this.navigate(`${defaultRedirectPage}`);
    }, 2000);
  }

  render(): JSX.Element {
    return <></>;
  }
}

export default HomePage;
