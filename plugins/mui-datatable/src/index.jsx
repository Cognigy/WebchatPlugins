import * as React from 'react';
import memoize from 'memoize-one';
import MUIDataTable from "mui-datatables";

import { getStyles } from './styles';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

// only re-calculate if theme changed
const getStylesMemo = memoize(getStyles);

const getMuiDatatableTheme = createMuiTheme({
    overrides: {
        MuiModal: {
            root: {
                zIndex: 10000
            }
        },
    }
});

const dismissedMessages = [];

const DataTable = (props) => {
    try {
        const { 
            isFullscreen,
            onSetFullscreen,
            theme,
            attributes,
            onDismissFullscreen,
            onSendMessage
        } = props;
        
        const displayMode = (props.message.data._plugin.displayMode) ? props.message.data._plugin.displayMode : 'inline';
        const tableTitle = (props.message.data._plugin.title) ? props.message.data._plugin.title : '';
        const tableColumns = (props.message.data._plugin.tabledata.columns) ? props.message.data._plugin.tabledata.columns : [];
        const tableData = (props.message.data._plugin.tabledata.data) ? props.message.data._plugin.tabledata.data : [];
        const tableOptions = (props.message.data._plugin.tabledata.options) ? props.message.data._plugin.tabledata.options : {};
    
        // override component default options
        tableOptions.selectableRows = (props.message.data._plugin.tabledata.options.selectableRows) ? props.message.data._plugin.tabledata.options.selectableRows : false;
        tableOptions.selectableRowsOnClick = (props.message.data._plugin.tabledata.options.selectableRowsOnClick) ? props.message.data._plugin.tabledata.options.selectableRowsOnClick : false;
        tableOptions.pagination = (props.message.data._plugin.tabledata.options.pagination) ? props.message.data._plugin.tabledata.options.pagination : false;
        tableOptions.download = (props.message.data._plugin.tabledata.options.download) ? props.message.data._plugin.tabledata.options.download : false;
        tableOptions.print = (props.message.data._plugin.tabledata.options.print) ? props.message.data._plugin.tabledata.options.print : false;
        tableOptions.filter = (props.message.data._plugin.tabledata.options.filter) ? props.message.data._plugin.tabledata.options.filter : false;
        tableOptions.search = (props.message.data._plugin.tabledata.options.search) ? props.message.data._plugin.tabledata.options.search : false;
        tableOptions.viewColumns = (props.message.data._plugin.tabledata.options.viewColumns) ? props.message.data._plugin.tabledata.options.viewColumns : false;

        tableOptions.onRowClick = (props.message.data._plugin.tabledata.options.rowClickPostback === true) ? (rowData, rowMeta) => onSendMessage('', { 'tabledata': { rowData, rowMeta }}): undefined;
        tableOptions.onCellClick = (props.message.data._plugin.tabledata.options.cellClickPostback === true) ? (cellData, cellMeta) => onSendMessage('', { 'tabledata': { cellData, cellMeta }}): undefined;

        const { 
            dialogStyles, 
            headerStyles, 
            contentStyles, 
            footerStyles, 
            cancelButtonStyles,
            openDialogButtonStyles
        } = getStylesMemo(theme);
    

        const dimissFullscreen = () => {
            dismissedMessages.push(props.message.traceId);
            onDismissFullscreen();
        }

        const returnFullscreenRender = () => {
            return (
                <div
                    {...attributes}
                    style={{
                        ...attributes.styles,
                        ...dialogStyles
                    }}
                >
                    <header style={headerStyles}>
                        {props.message.data._plugin.headerText || tableTitle}
                    </header>
                    <main style={contentStyles}>
                        {props.message.data._plugin.subtitleText}
                        <div style={{'background-color': '#ffffff'}}>
                        <MuiThemeProvider theme={getMuiDatatableTheme}>
                                <MUIDataTable
                                    title={tableTitle}
                                    data={tableData}
                                    columns={tableColumns}
                                    options={tableOptions}
                                />
                            </MuiThemeProvider>
                        </div>
                    </main>
                    <footer style={footerStyles}>
                        <button
                            type='button'
                            onClick={dimissFullscreen}
                            style={cancelButtonStyles}
                        >
                            {props.message.data._plugin.cancelButtonText || "dismiss"}
                        </button>
                    </footer>
                </div>
            )
        }
    
        switch (displayMode) {
            case "toggle":
                if (!isFullscreen) {
                    return (
                        <button
                            type='button'
                            onClick={onSetFullscreen}
                            style={openDialogButtonStyles}
                        >
                            {props.message.data._plugin.buttonText}
                        </button>
                    )
                }
         
                return returnFullscreenRender();
    
            default:
                return (
                    <MUIDataTable
                        title={tableTitle}
                        data={tableData}
                        columns={tableColumns}
                        options={tableOptions}
                        />
                )
        }
    } catch(err) {
        console.log(err.message);
        return (
            <div>Oops, something went wrong.</div>
        );
    }

    
}

const datatablePlugin = {
    match: 'datatable',
    component: DataTable
}

if (!window.cognigyWebchatMessagePlugins) {
    window.cognigyWebchatMessagePlugins = []
}

window.cognigyWebchatMessagePlugins.push(datatablePlugin);
