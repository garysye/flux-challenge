import AppDispatcher from '../dispatchers/AppDispatcher';
import SithConstants from '../constants/SithConstants';

var SithActions = {
  initialize(numSlots, sithId) {
    AppDispatcher.dispatch({
      actionType: SithConstants.INITIALIZE,
      numSlots: numSlots,
      sithId: sithId
    });
  },

  scrollUp(numSlots) {
    AppDispatcher.dispatch({
      actionType: SithConstants.SCROLL_UP,
      numSlots: numSlots
    });
  },

  scrollDown(numSlots) {
    AppDispatcher.dispatch({
      actionType: SithConstants.SCROLL_DOWN,
      numSlots: numSlots
    });
  }
};

export default SithActions;
