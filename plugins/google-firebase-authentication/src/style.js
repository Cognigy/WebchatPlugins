export const root = {
  height: '100px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
};

export const googleBtn = {
  width: '240px',
  height: '50px',
  backgroundColor: '#4285f4',
  borderRadius: '2px',
  boxShadow: '0 3px 4px 0 rgba(0,0,0,.25)',
  display: 'flex',
  alignItems: 'center'
};

export const googleIconWrapper = {
  position: 'relative',
  width: '50px',
  height: '50px',
  borderRadius: '2px',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

export const googleIcon = {
  width: '18px',
  height: '18px'
};

export const btnText = {
  float: 'right',
  marginRight: '6px',
  marginLeft: '12px',
  color: '#fff',
  fontSize: '16px',
  lineHeight: '48px',
  fontWeight: '500',
  letterSpacing: '.21px',
  verticalAlign: 'top',
  fontFamily: "'Helvetica', 'Arial', sans-serif",
  "&:hover": {
    boxShadow: '0 0 6px #4285f4'
  },
  "&:active": {
    background: '#1669F2'
  }
}