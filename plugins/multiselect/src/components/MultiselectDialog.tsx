import * as React from 'react';

import mod from '../utils/modulo';
import matcher from '../utils/matcher';

import Background from '@cognigy/webchat/src/webchat-ui/components/presentational/Background';
import { styled } from '@cognigy/webchat/src/webchat-ui/style';

import { ThemeProvider } from 'emotion-theming';

import { IMultiselectProps } from '../Multiselect';
import sanitizedData from '../utils/sanatize';

const DialogRoot = styled.div(() => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    margin: 0,
    overflow: 'hidden'
}));

const Header = React.memo(
    styled(Background)(() => ({
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        fontSize: 16,
        fontWeight: 700,
        width: '100%',
        zIndex: 2
    }))
);

const Content = styled('div')(({ theme }) => ({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'hidden'
}));

const Footer = React.memo(
    styled.div(({ theme }) => ({
        backgroundColor: theme.greyStrongColor,
        display: 'flex',
        paddingTop: theme.unitSize,
        paddingBottom: theme.unitSize
    }))
);

const Title = styled.div(({ theme }) => ({
    color: theme.primaryContrastColor,
    fontSize: theme.unitSize * 2.5,
    marginTop: theme.unitSize * 3,
    marginBottom: theme.unitSize * 3,
    paddingLeft: theme.unitSize * 2,
    paddingRight: theme.unitSize * 2
}));

const TextInput = styled.input(({ theme }) => ({
    background: theme.greyStrongColor,
    border: 0,
    borderBottom: '1px solid #0002',
    boxSizing: 'border-box',
    display: 'block',
    flexGrow: 0,
    outline: 'none',
    padding: theme.unitSize * 2,
    paddingBottom: theme.unitSize * 1.75,
    '&:focus': {
        boxShadow: theme.shadow
    }
}));

const OptionsList = styled.div(() => ({
    borderBottom: '1px solid #0001',
    display: 'flex',
    flexBasis: '100%',
    flexDirection: 'column',
    flexShrink: 1,
    overflowY: 'auto',
    overflowX: 'hidden'
}));

const ChosenOptionList = styled('div')(({ theme }) => ({
    background: theme.greyStrongColor,
    boxShadow: theme.shadow,
    display: 'flex',
    flexGrow: 1,
    flexShrink: 0,
    flexDirection: 'column',
    maxHeight: '33%',
    overflowX: 'auto',

    '& > button': {
        color: theme.greyContrastColor
    }
}));

const Option = React.memo(
    styled.button(({ theme }) => ({
        backgroundColor: 'transparent',
        border: 'none',
        color: theme.greyContrastColor,
        cursor: 'pointer',
        paddingTop: theme.unitSize,
        paddingBottom: theme.unitSize,
        paddingLeft: theme.unitSize * 2,
        paddingRight: theme.unitSize * 2,
        textAlign: 'left',
        userSelect: 'none',

        '&:focus': {
            backgroundColor: theme.greyWeakColor,
            outline: 'none'
        },

        '&:first-of-type': {
            marginTop: theme.unitSize * 0.5
        }
    }))
);

const Button = styled('button')(({ theme }) => ({
    backgroundColor: theme.greyColor,
    border: 'none',
    borderRadius: theme.unitSize * 2,
    color: theme.greyContrastColor,
    cursor: 'pointer',
    flexGrow: 1,
    height: 40,
    margin: `${theme.unitSize * 0.5}px ${theme.unitSize}px !important`,
    padding: `${theme.unitSize}px ${theme.unitSize * 2}px`
}));

const CancelButton = styled(Button)(({ theme }) => ({
    backgroundColor: 'transparent',
    border: `1px solid ${theme.primaryColor}`,
    color: theme.primaryColor
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    background: theme.primaryGradient,
    color: theme.primaryContrastColor,
    flexGrow: 2,
    marginLeft: theme.unitSize * 2
}));

const MultiselectDialog: React.FC<IMultiselectProps> = props => {
    const { theme, onDismissFullscreen, onSendMessage } = props;
    const { text } = props.message;
    const {
        allowUserAnswers,
        cancelButtonLabel,
        inputPlaceholder,
        options,
        submitButtonLabel
    } = props.message.data._plugin;

    const [inputValue, setInputValue] = React.useState<string>('');

    const [filteredOptions, setFilteredOptions] = React.useState<string[]>([]);

    const [chosenOptions, setChosenOptions] = React.useState<string[]>([]);

    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    /*
     * Filter the options
     */
    React.useEffect(() => {
        let filtered = options.filter(option => {
            /*
             * Hide the option if it has already been selected
             */
            if (chosenOptions.includes(option)) return false;

            /*
             * If there is no filter string, include option
             */
            if (!inputValue) return true;

            /*
             * Otherwise test if the option matches filter string
             */
            return matcher(option, inputValue);
        });

        /*
         * Add filter as a value to the list of options if custom answer allowed
         */
        if (inputValue && allowUserAnswers) filtered.push(inputValue);

        setFilteredOptions(filtered);
    }, [inputValue, chosenOptions]);

    /*
     * Keyboard navigation for option list
     */
    React.useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredOptions]);

    React.useEffect(() => {
        if (selectedIndex === -1) {
            textInputRef.current?.focus();
        } else {
            optionInFocusRef.current?.focus();
        }
    }, [selectedIndex]);

    const optionInFocusRef = React.useRef<HTMLButtonElement>(null);
    const textInputRef = React.useRef<HTMLInputElement>(null);

    const handleKeyDown = (event: KeyboardEvent) => {
        const { keyCode } = event;
        if ([38, 40, 27].indexOf(keyCode) !== -1) {
            event.preventDefault();
        }
        /*
         * Up Arrow key, select previous option, or focus the input
         */
        if (keyCode === 38) {
            setSelectedIndex(index => (index > 0 ? index - 1 : -1));
        }
        /*
         * Down Arrow key, select next option
         */
        if (keyCode === 40) {
            setSelectedIndex(index => mod(index + 1, filteredOptions.length));
        }
        /*
         * Escape key
         */
        if (keyCode === 27) {
            setSelectedIndex(-1);
        }
    };

    const handleOptionClick = React.useMemo(
        () => event => {
            event.preventDefault();
            const value = event.target.textContent || event.target.value;

            /*
             * Remove from chosen list
             */
            if (chosenOptions.includes(value)) {
                setChosenOptions(selected => [...selected.filter(option => option !== value)]);
                return;
            }

            /*
             * Add to chosen list
             */
            setChosenOptions(selected => [value, ...selected]);
        },
        [chosenOptions]
    );

    const handleSubmit = (e: React.MouseEvent) => {
        e.preventDefault();
        onSendMessage('', {
            multiselect: chosenOptions
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <DialogRoot {...props.attributes}>
                <Header color="primary" className="webchat-header-bar">
                    <Title dangerouslySetInnerHTML={sanitizedData(text)}></Title>
                </Header>

                <Content>
                    <TextInput
                        autoFocus={true}
                        className="webchat-multiselect-input"
                        onChange={event => setInputValue(event.target.value)}
                        onKeyDown={event =>
                            event.keyCode === 13 && allowUserAnswers
                                ? handleOptionClick(event)
                                : null
                        }
                        placeholder={inputPlaceholder || 'Select an option or enter your own'}
                        onFocus={() => setSelectedIndex(-1)}
                        ref={textInputRef}
                        tabIndex={2}
                    />
                    <OptionsList>
                        {filteredOptions.map((option, index) => (
                            <Option
                                ref={index === selectedIndex ? optionInFocusRef : null}
                                onClick={handleOptionClick}
                                key={index}
                                tabIndex={0}
                                dangerouslySetInnerHTML={sanitizedData(option)}>
                            </Option>
                        ))}
                    </OptionsList>
                    <ChosenOptionList>
                        {chosenOptions.map((option, index) => (
                            <Option
                                key={index}
                                onClick={handleOptionClick}
                                tabIndex={1}
                                dangerouslySetInnerHTML={sanitizedData(option)}>
                            </Option>
                        ))}
                    </ChosenOptionList>
                </Content>

                <Footer>
                    <CancelButton onClick={onDismissFullscreen}>{cancelButtonLabel}</CancelButton>
                    <SubmitButton onClick={handleSubmit}>{submitButtonLabel}</SubmitButton>
                </Footer>
            </DialogRoot>
        </ThemeProvider>
    );
};

export default MultiselectDialog;
