import axios from 'axios';

import {
  FETCH_SEARCHNOTICE,
  MODIFY_SEARCH_NOTICE,
  POST_NEW_SEARCHNOTICE,
  MODIFY_STATUS_SEARCH_NOTICE,
  closeSearchformNotice,
  fetchSearchnotice,
  handleSuccessfulModification,
  saveAllSearchNotices,
  handleSuccessfulPost,
  REMOVE_SEARCH_NOTICE,
  handleSuccessfulDeleteSearchNotice,
  handleErrorDeleteSearchNotice,
  handleErrorPostSearchNotice,
} from '../actions/searchAction';

const searchMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case FETCH_SEARCHNOTICE:
      axios
        .get('https://apicalypse.theonlyflo.com/api/v1/search-notice')
        .then((response) => {
          // console.log(response.data);
          store.dispatch(saveAllSearchNotices(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
      break;
    case MODIFY_SEARCH_NOTICE:
      axios
        .put(
          `https://apicalypse.theonlyflo.com/api/v1/search-notice/${action.id}`,
          action.searchnoticeModified,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token_jwt')}`,
            },
          }
        )
        .then((response) => {
          console.log('response', response);
          store.dispatch(fetchSearchnotice());
          store.dispatch(handleSuccessfulModification());
          store.dispatch(closeSearchformNotice(action.id));
        })
        .catch((error) => {
          console.log(error);
        });
      break;
    case MODIFY_STATUS_SEARCH_NOTICE:
      axios
        .patch(
          `https://apicalypse.theonlyflo.com/api/v1/search-notice/${action.id}`,
          { status: 1 },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token_jwt')}`,
            },
          }
        )
        .then((response) => {
          store.dispatch(fetchSearchnotice());
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case POST_NEW_SEARCHNOTICE:
      console.log(action.newSearchnotice);
      axios
        .post(
          'https://apicalypse.theonlyflo.com/api/v1/search-notice',
          action.newSearchnotice,
          {
            headers: {
              'Content-Type': 'multipart/form-data',

              Authorization: `Bearer ${localStorage.getItem('token_jwt')}`,
            },
          }
        )
        .then((response) => {
          store.dispatch(fetchSearchnotice());
          store.dispatch(handleSuccessfulPost());
        })
        .catch((error) => {
          console.error(error);
          store.dispatch(
            handleErrorPostSearchNotice("Une erreur s'est produite")
          );
        });
      break;
    case REMOVE_SEARCH_NOTICE:
      axios
        .delete(
          `https://apicalypse.theonlyflo.com/api/v1/search-notice/${action.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token_jwt')}`,
            },
          }
        )
        .then(() => {
          store.dispatch(fetchSearchnotice());
          store.dispatch(handleSuccessfulDeleteSearchNotice());
        })
        .catch((error) => {
          console.error(error);
          store.dispatch(handleErrorDeleteSearchNotice());
        });
      break;
    default:
      break;
  }
  next(action);
};

export default searchMiddleware;
