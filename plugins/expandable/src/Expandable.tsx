import * as React from 'react';
import { MessageComponentProps } from '@cognigy/webchat/src/common/interfaces/message-plugin';
import { IBotMessage } from '@cognigy/webchat/src/common/interfaces/message';
import sanitizedData from "./utils/sanatize";

interface IExpandableMessage extends IBotMessage {
    data: {
        _plugin: {
            type: 'expandable';
            text: string;
            characterLimit: number;
            expandTitle: string;
            previewEnd: string;
        };
    };
}

export interface IExpandableProps extends MessageComponentProps {
    message: IExpandableMessage;
}

function expand(event) {
    let button = event.target
    let container = button.parentNode
    let containerChildren = container.children
    for (let i = 0; i < containerChildren.length; i++) {
        let element =  containerChildren[i]
        let classList =  element.classList
        if (classList.contains("expandablePreviewEnd")) {
            element.style.display = "none"
        }
        if (classList.contains("expandableButton")) {
            element.style.display = "none"
        }
        if (classList.contains("expandableExpansion")) {
            element.style.display = "inline"
        }
    }
}

const Expandable = (props) => {

    const {attributes, message} = props
    const pluginData = message?.data?._plugin
    const text = pluginData?.text ? pluginData?.text : "";
    const characterLimit = pluginData?.characterLimit ? pluginData?.characterLimit : 150;
    const expandTitle = pluginData?.expandTitle ? pluginData?.expandTitle : "Show More";
    const previewEnd = pluginData?.previewEnd ? pluginData?.previewEnd : " ";

    if (text.length > characterLimit) {
        const preview = text.substring(0,characterLimit);
        const expansion = text.substring(characterLimit,);
        return (
            <div {...attributes}>
                <div 
                    className= "regular-message bot expandableContainer"
                    style={{"float":"left"}}>
                    <span 
                        className="expandableStart" 
                        style={{"display":"inline"}}
                        dangerouslySetInnerHTML={sanitizedData(preview)}>
                    </span>
                    <span 
                        className="expandablePreviewEnd" 
                        style={{"display":"inline"}}
                        dangerouslySetInnerHTML={sanitizedData(previewEnd)}>
                    </span>
                    <span 
                        className="expandableButton" 
                        onClick={(event) => expand(event)}
                        style={{"display":"inline", 
                            "color":"blue",
                            "cursor":"pointer"}}
                        dangerouslySetInnerHTML={sanitizedData(expandTitle)}>
                    </span>
                    <span 
                        className="expandableExpansion" 
                        style={{"display": "none"}}
                        dangerouslySetInnerHTML={sanitizedData(expansion)}>
                    </span>
                </div>
            </div>
        );
    } else {
        return (
            <div {...attributes}>
                <div
                    className= {"regular-message bot expandableContainer" }
                    style={{"float":"left"}}>
                    <span 
                        className="expandableStart" 
                        style={{"display":"inline"}}
                        dangerouslySetInnerHTML={sanitizedData(text)}>
                    </span>
                </div>
            </div>
        );
    }
};

export default Expandable;
