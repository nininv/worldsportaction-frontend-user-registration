import ApiConstants from "../../themes/apiConstants";
import { Encrypt, Decrypt } from "../../util/encryption";
import { JwtEncrypt, JwtDecrypt } from "../../util/jwt";
import history from "../../util/history";
import { setAuthToken, setUserId, setName, setPhotoUrl, setStripeAccountId, setStripeAccountConnectId } from '../../util/sessionStorage'

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  loggedIn: false,
  passwordInputs: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  },
  forgotPasswordSuccess: false,
  forgotPasswordMessage: ''
};

function login(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.API_LOGIN_LOAD:
      localStorage.removeItem("token");
      localStorage.removeItem('stripeCustomerAccountId')
      return { ...state, onLoad: true };

    case ApiConstants.API_LOGIN_SUCCESS:
      setUserId(action.result.user.id)
      setAuthToken(action.result.authToken)
      let name = action.result.user.firstName + ' ' + action.result.user.lastName;
      setName(name);
      setPhotoUrl(action.result.user.photoUrl);
      setStripeAccountId(action.result.user.stripeCustomerAccountId)
      setStripeAccountConnectId(action.result.user.stripeAccountId)
      // localStorage.setItem("token", action.result.authToken);
      // let jwtEncrypt = JwtEncrypt(action.result.result.data.user_data)
      // let encryptText = Encrypt(jwtEncrypt)
      // let decryptText = Decrypt(encryptText)
      // let jwtDecrypt = JwtDecrypt(decryptText)
      // history.push("/");
      // window.location.reload();
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        loggedIn: true
      };

    case ApiConstants.API_LOGIN_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    case ApiConstants.API_LOGIN_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status
      };

    case ApiConstants.API_FORGOT_PASSWORD_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.API_FORGOT_PASSWORD_SUCCESS:
      if (action.source !== "mobile") {
        localStorage.removeItem("channel")
      }
      return {
        ...state,
        forgotPasswordMessage: action.result.message ? action.result.message : '',
        onLoad: false,
        forgotPasswordSuccess: true,
        status: action.status,
      };
    case ApiConstants.ACTION_TO_UPDATE_PASSWORD_FIELDS:
      let passwords = { ...state.passwordInputs };
      passwords[action.key] = action.value;
      return {
        ...state,
        passwordInputs: passwords
      };

    case ApiConstants.API_UPDATE_PASSWORD:
      return { ...state, onLoad: true };

    case ApiConstants.API_UPDATE_PASSWORD_SUCCESS:
      return {
        ...state,
        onLoad: false,
        status: action.status,
        error: null
      };

    case ApiConstants.ACTION_TO_CLEAR_AUTHENTICATION_REDUCER:
      if (action.key == "clearPasswordSuccess") {
        state.forgotPasswordSuccess = false
      }
      localStorage.removeItem("channel")
      return {
        ...state,
        onLoad: false,
      }

    default:
      return state;
  }
}

export default login;
