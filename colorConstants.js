import {color} from 'react-native-elements/dist/helpers';

export const colors = {
  primary: '#FFAF4E',
  secondary: '#fff',
  input: '#414BB222',
  accent: '#ffffb2',
};

export const appStyles = {
  // styles to be imported and used across the app
  // these styles should not set layout, e.g. do not set height here
  mainView: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  insetBox: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 5,
    paddingHorizontal: 5,
    marginVertical: 65,
  },
  insetHeader: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
  },
  insetText: {
    color: 'white',
    padding: 5,
  },
  screenTitleContainer: {
    flex: 1,
    marginTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading1: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  heading2: {
    textAlign: 'center',
    fontSize: 22,
    fontStyle: 'italic',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  warningText: {
    color: 'red',
  },
  textInputBox: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.primary,
    color: 'black',
    borderRadius: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  highlight: {
    borderColor: colors.accent,
    borderWidth: 4,
  },
  timer: {
    fontSize: 100,
  },
};
