import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('BudgetMate', () => App);
AppRegistry.runApplication('BudgetMate', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});
