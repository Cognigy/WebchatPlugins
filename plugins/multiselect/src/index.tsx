import { MessagePlugin } from "@cognigy/webchat/src/common/interfaces/message-plugin";
import Multiselect from "./Multiselect";
import { registerMessagePlugin } from "@cognigy/webchat/src/plugins/helper";

const multiselectPlugin: MessagePlugin = {
    match: 'multiselect',
    component: Multiselect
};

registerMessagePlugin(multiselectPlugin);
