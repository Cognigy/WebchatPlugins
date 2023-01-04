const root = theme => ({
  background: theme.primaryContrastColor,
  // color: theme.primaryContrastColor,
  display: 'flex',
  flexDirection: 'column',
  minHeight: theme.blockSize,
  boxShadow: theme.shadow,
  paddingTop: theme.unitSize * 2,
  paddingBottom: theme.unitSize * 2
});

const divider = theme => ({
  backgroundColor: theme.primaryColor,
  height: '1px',
  marginLeft: theme.unitSize * 2,
  marginRight: theme.unitSize * 2,
  marginTop: theme.unitSize * 2,
  marginBottom: theme.unitSize
});

const channelIcon = theme => ({
  width: `35px`,
  cursor: 'pointer',
  paddingTop: theme.unitSize,
  paddingBottom: theme.unitSize * 2,
  paddingRight: theme.unitSize * 2
});

const title = theme => ({
  paddingTop: theme.unitSize,
  paddingBottom: theme.unitSize,
  paddingLeft: theme.unitSize * 2,
  paddingRight: theme.unitSize * 2,
  fontFamily: 'sans-serif'
});

const iconsRoot = theme => ({
  display: 'flex',
  flexDirection: 'row',
  paddingLeft: theme.unitSize * 2,
  paddingRight: theme.unitSize * 2,
});

export const getStyles = theme => {
  const rootStyles = root(theme);
  const channelIconStyles = channelIcon(theme);
  const iconsRootStyles = iconsRoot(theme);
  const titleStyles = title(theme);
  const dividerStyles = divider(theme);

  return {
    rootStyles,
    channelIconStyles,
    iconsRootStyles,
    titleStyles,
    dividerStyles
  }
};