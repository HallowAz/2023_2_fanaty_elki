import { Api } from "../../modules/api";
import type { LoginData, SignUpData } from "../../modules/api";

type User = {
    username: string;
};

/**
 * Модель пользователя
 * Хранит сессию текущего пользователя и предоставляет интефейс для получения данных о пользователях с бекэнд
 * @class
 */
export default class UserModel {
    /**
     * Текущий пользователь
     */
    private _currentUser: User | null;

    /**
     * Конструктор
     * Инициализирует текущего пользователя null'ом
     */
    constructor() {
        this._currentUser = null;
    }

    get currentUser(): User | null {
        return this._currentUser;
    }

    /**
     * Получает ответ на запрос об аутентификации по cookies,
     * сохраняет данные пользователя в currentUser, если операция успешна
     * @async
     */
    async auth() {
        this._currentUser = null;
        this._currentUser = await Api.authUser();
    }

    /**
     * Получает ответ на запрос об авторизации,
     * сохраняет данные в currentUser, если операция успешна
     * @async
     * @param {Object} login_data - данные пользователя
     */
    async login(login_data: LoginData) {
        this._currentUser = null;
        this._currentUser = await Api.loginUser(login_data);
    }

    /**
     * Получает ответ на запрос о регистрации
     * и возвращает
     * @async
     * @param {Object} signup_data - данные пользователя
     */
    async signup(signup_data: SignUpData) {
        await Api.createUser(signup_data);
    }

    /**
     * Получает ответ на запрос о выходе из аккаунта,
     * сохраняет null в currentUser, если операция успешна
     * @async
     */
    async logout() {
        await Api.logoutUser();
        this._currentUser = null;
    }
}
