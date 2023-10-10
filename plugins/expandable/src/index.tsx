import { MessagePlugin } from '@cognigy/webchat/src/common/interfaces/message-plugin';
import Expandable from './Expandable';
import { registerMessagePlugin } from '@cognigy/webchat/src/plugins/helper';

const expandablePlugin: MessagePlugin = {
    match: 'expandable',
    component: Expandable
};

registerMessagePlugin(expandablePlugin);
