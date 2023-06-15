import {useDispatch} from "react-redux";
import {RootActionsType, RootStateType} from "../bll/store";
import {ThunkDispatch} from 'redux-thunk';

export type ThunkDispatchType = ThunkDispatch<RootStateType, any, RootActionsType>

export const useAppDispatch = () => useDispatch<ThunkDispatchType>();