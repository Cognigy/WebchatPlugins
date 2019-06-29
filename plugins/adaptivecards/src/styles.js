export const CSSInjectionStyles = theme => { 
  return {
    "acPushbuttonSubdued": `{ 
        background-color: transparent;
        border: 1px solid ${theme.primaryColor};
        color: ${theme.primaryColor};
    
        cursor: pointer;
        height: 40;
    
        padding: ${theme.unitSize}px ${theme.unitSize * 2}px;
        border-radius: ${theme.unitSize * 2}px;
    }`,
    "acPushbuttonExpanded": `{ 
        background: ${theme.primaryGradient};
        color: ${theme.primaryContrastColor};
        border: 1px solid ${theme.primaryColor};
    
        cursor: pointer;
        height: 40;
    
        padding: ${theme.unitSize}px ${theme.unitSize * 2}px;
        border-radius: ${theme.unitSize * 2}px;
    }`,
    "acInput": `{ 
        border: 1px solid ${theme.primaryColor};
        height: 40;
        padding: ${theme.unitSize}px ${theme.unitSize * 2}px;
    }`
  }
};