import { Api } from "../modules/api/src/api";
import { EventDispatcher, Listenable } from "../modules/observer";

export type User = {
    Username: string;
    Birthday: string;
    PhoneNumber: string;
    Email: string;
    Password: string;
    Icon: string;
};

export const enum UserEvent {
    USER_CHANGE = "USER_CHANGE",
    ADDRESS_CHANGE = "ADDRESS_CHANGE",
}

/**
 * Модель пользователя
 * @class
 */
export class UserModel implements Listenable<UserEvent> {
    /**
     * Пользователь
     */
    private user: User | null;
    private address: string;
    private errorMsg: string | null;

    private events_: EventDispatcher<UserEvent>;
    get events(): EventDispatcher<UserEvent> {
        return this.events_;
    }

    /**
     * Конструктор
     */
    constructor() {
        this.events_ = new EventDispatcher<UserEvent>();
        this.user = null;
    }

    /**
     * Получение пользователя
     * @returns {User} - пользователь
     */
    getUser(): User | null {
        return this.user;
    }

    /**
     * Получение сообщения об ошибке
     */
    getErrorMsg(): string | null {
        return this.errorMsg;
    }

    /**
     * Авторизация по cookie
     * @async
     */
    async auth() {
        this.user = await Api.authUser();
        this.events.notify();
    }

    async createUser(user: User) {
        try {
            await Api.createUser(user);
        } catch (e) {
            this.errorMsg = (e as Error).message;
        }
        this.events.notify();
    }

    /**
     * Авторизация по имени пользователя и паролю
     * @async
     * @param username - имя пользователя
     * @param password - пароль
     */
    async login(username: string, password: string) {
        try {
            this.user = await Api.loginUser({
                username,
                password,
            });
            this.errorMsg = null;
        } catch (e) {
            this.errorMsg = (e as Error).message;
        }
        this.events.notify();
    }

    /**
     * Завершение сессии
     * @async
     */
    async logout() {
        try {
            await Api.logoutUser();
            this.user = null;
            this.errorMsg = null;
        } catch (e) {
            this.errorMsg = (e as Error).message;
        }
        this.events.notify();
    }

    setAddress(address: string) {
        this.address = address;
        this.events.notify(UserEvent.ADDRESS_CHANGE);
    }

    getAddress() {
        return this.address;
    }
}
