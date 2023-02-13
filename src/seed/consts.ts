import { v4 as uuidv4 } from 'uuid';

export const SETTING_APP_ID = `${process.env.APP_NAME}-setting-app-id`;

export const USER_DEFAULT_ID = process.env.USER_ID;
export const DATA_TYPE_TEXT_ID = 'data-type-type-text';
export const DATA_TYPE_FILE_SELECT_ID = 'data-type-type-file-select';

export const USER_STATUS_ACTIVE_ID = 'sso-user-status-active';
export const USER_STATUS_NEW_ID = 'sso-user-status-new';

export const USER_OPTION_FIRSTNAME_ID = 'sso-user-option-firstname';
export const USER_OPTION_LASTNAME_ID = 'sso-user-option-lastname';
export const USER_OPTION_AVATAR_ID = 'sso-user-option-avatar';

export const USER_ADMIN_ID = process.env.USER_ID;

export const USER_ADMIN_ID_OPTION_FIRSTNAME = uuidv4();
export const USER_ADMIN_ID_OPTION_LASTNAME = uuidv4();

export const ROLE_STATUS_ACTIVE_ID = uuidv4();

export const ROLE_ADMIN_ID = 'sso-role-admin';
export const ROLE_MEMBER_ID = 'sso-role-member';

export const ACCESS_STATUS_ACTIVE_ID = uuidv4();

export const ACCESS_ROOT_ID = 'sso-access-root';
