import { action, cache } from '@solidjs/router';
import {
  getUser as gU,
  getUsersId as gUi,
  getLocationById,
  logout,
  login,
  register,
  nameChange,
  changePassword,
  userLists,
  regenerateKey,
  listLocations,
  list,
  sensorNodesLists,
  newList,
  addRemoveSensorNodesList,
  deleteList,
  removeSensorNodesList,
  updateList,
  verifyEmail,
  forgotPassword,
  forgotPasswordLink,
  deleteListLocation,
  resendVerificationEmail
} from './server';

export const getUserId = cache(gUi, 'user');
export const getUser = cache(gU, 'user');
export const loginAction = action(login, 'login');
export const logoutAction = action(logout, 'logout');
export const registerAction = action(register, 'register');
export const nameChangeAction = action(nameChange, 'name-change');
export const passwordChangeAction = action(
  changePassword,
  'password-change'
);
export const newListAction = action(newList, 'new-list')
export const updateListAction = action(updateList, 'update-list')
export const deleteListAction = action(deleteList, 'delete-list')

export const getUserLists = cache(userLists, 'user-lists');
export const getList = cache(list, 'list');

export const getLocationsByListId = cache(listLocations, 'list-locations')
export const getLocation = cache(getLocationById, 'location');
export const getListsBySensorNodesId = cache(sensorNodesLists, 'sensor-nodes-lists')

export const removeSensorNodeFromListAction = action(removeSensorNodesList, 'remove-sensor-nodes-list')
export const sensorNodesListModifyAction = action(addRemoveSensorNodesList, 'add-remove-sensor-nodes-list')

export const regenerateKeyAction = action(
  regenerateKey,
  'regenerate-key'
);

export const deleteListLocationAction = action(deleteListLocation, 'delete-location-list');


export const forgotPasswordAction = action(forgotPassword, 'forgot-password')
export const forgotPasswordLinkAction = action(forgotPasswordLink, 'forgot-password-link')

export const verify = cache(verifyEmail, 'verify-email');

export const resendVerificationEmailAction = action(resendVerificationEmail, 'resend-verification-email')