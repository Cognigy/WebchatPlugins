const button = theme => ({
  backgroundColor: theme.greyColor,
  color: theme.greyContrastColor,
  cursor: "pointer",
  border: "none",
  height: 40,
  padding: `${theme.unitSize}px ${theme.unitSize * 2}px`,
  borderRadius: theme.unitSize * 2,
})

const primaryButton = theme => ({
  ...button(theme),
  background: theme.primaryGradient,
  color: theme.primaryContrastColor
})

const outlinedButton = theme => ({
  ...button(theme),
  backgroundColor: 'transparent',
  border: `1px solid ${theme.primaryColor}`,
  color: theme.primaryColor
})

const submitButton = theme => ({
  ...primaryButton(theme),
  flexGrow: 2,
  marginLeft: theme.unitSize * 2
})

const cancelButton = theme => ({
  ...button(theme),
  flexGrow: 1
})

const openDialogButton = theme => ({
  ...outlinedButton(theme),
  '&[disabled]': {
    borderColor: theme.greyColor,
    color: theme.greyColor,
    cursor: 'default'
  }
})

const dialog = theme => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch'
})

const padding = theme => ({
  paddingTop: theme.unitSize,
  paddingBottom: theme.unitSize,
  paddingLeft: theme.unitSize * 2,
  paddingRight: theme.unitSize * 2
})

const header = theme => ({
  ...padding(theme),
  display: 'flex',
  alignItems: 'center',
  minHeight: theme.blockSize,
  boxSizing: 'border-box',
  background: theme.primaryGradient,
  color: theme.primaryContrastColor,
  fontWeight: 'bolder',
  boxShadow: theme.shadow,
  zIndex: 2
})

const content = theme => ({
  ...padding(theme),
  flexGrow: 1,
  flexDirection: 'column',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const footer = theme => ({
  ...padding(theme),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'white',
  boxShadow: theme.shadow,
})

const spinnerContainer = theme => ({
  alignItems: 'center',
  backgroundColor: theme.greyColor,
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  width: '100%',
})

const methods__icons = theme => ({
  display: 'flex'
})

const method__icon__container = theme => ({
  flex: '1 0 15%',
  margin: '5px',
  height: '35px'
})

const method__icon__outer_circle = theme => ({
  backgroundColor: 'white',
  borderRadius: '50%',
  width: '15px',
  height: '15px',
  padding: '10px'
})

const methods_icon = theme => ({
  verticalAlign: 'middle',
  width: '30px',
  height: '30px',
  marginTop: '-5px',
  marginLeft: '-5px',
  marginRight: '1px',
  borderRadius: '50%'
})

const errorMessage = theme => ({
  color: theme.errorColor || '#b74e4e',
  display: 'block',
  ...padding(theme),
  textAlign: 'center'
})

export const getStyles = theme => {
  const openDialogButtonStyles = openDialogButton(theme);
  const headerStyles = header(theme);
  const contentStyles = content(theme);
  const footerStyles = footer(theme);
  const submitButtonStyles = submitButton(theme);
  const cancelButtonStyles = cancelButton(theme);
  const dialogStyles = dialog(theme);
  const spinnerContainerStyles = spinnerContainer(theme);
  const methodIconStyles = methods__icons(theme);
  const methodIconContainertyles = method__icon__container(theme);
  const methodIconOuterCircleStyles = method__icon__outer_circle(theme);
  const methodsIconStyles = methods_icon(theme);
  const errorMessageStyles = errorMessage(theme);

  return {
    openDialogButtonStyles,
    headerStyles,
    contentStyles,
    footerStyles,
    submitButtonStyles,
    cancelButtonStyles,
    dialogStyles,
    spinnerContainerStyles,
    methodIconStyles,
    methodIconContainertyles,
    methodIconOuterCircleStyles,
    methodsIconStyles,
    errorMessageStyles
  }
};