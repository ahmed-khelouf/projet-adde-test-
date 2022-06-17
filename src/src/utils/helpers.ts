import {
  GenericMessageEvent,
  MessageEvent,
  ReactionAddedEvent,
  ReactionMessageItem,
  BlockButtonAction,
  BlockElementAction,
  DialogSubmitAction,
  WorkflowStepEdit,
  InteractiveAction,
  ButtonAction,
  SlackAction,
  BlockAction
} from '@slack/bolt';

export const isGenericMessageEvent = (msg: MessageEvent):
  msg is GenericMessageEvent => (msg as GenericMessageEvent).subtype === undefined;

export const isMessageItem = (item: ReactionAddedEvent['item']):
  item is ReactionMessageItem => (item as ReactionMessageItem).type === 'message';


  export const isBlockButtonElementAction = (item: DialogSubmitAction | WorkflowStepEdit | BlockElementAction | InteractiveAction):
  item is ButtonAction => (item as BlockElementAction).type === 'button';

  export const isBlockAction = (item: SlackAction):
  item is BlockAction => (item as SlackAction).type === 'block_actions';
