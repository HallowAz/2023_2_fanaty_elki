import { VIEW_EVENT_TYPE } from "../../../../Controller/Controller";
import { UserEvent } from "../../../../Model/UserModel";
import { UIEvent, UIEventType } from "../../../../config";
import { EventDispatcher, Listenable } from "../../../../modules/observer";
import { IWidget } from "../../../types";
import navbarTemplate from "../ui/Navbar.hbs";

export class Navbar extends IWidget implements Listenable<UIEvent> {
    private userNameElement: HTMLElement;
    private signInButton: HTMLElement;
    private cartButton: HTMLElement;

    private events_: EventDispatcher<UIEvent>;
    get events(): EventDispatcher<UIEvent> {
        return this.events_;
    }

    constructor() {
        super(navbarTemplate(), ".navbar");
        this.events_ = new EventDispatcher<UIEvent>();

        model.userModel.events.subscribe(this.update.bind(this));
        model.cartModel.events.subscribe(this.updateCartIcon.bind(this));

        this.userNameElement = <HTMLElement>(
            this.element.querySelector("#name-container")
        );
        this.signInButton = <HTMLElement>(
            this.element.querySelector("#signin-button")
        );
        this.cartButton = <HTMLElement>this.element.querySelector("#cart");

        this.bindEvents();
        this.setNonAuthUser();
    }

    get searchValue() {
        return (
            (<HTMLInputElement>(
                (<HTMLFormElement>this.getAll(".js_search-input")[0])[0]
            )).value.trim() ||
            (<HTMLInputElement>(
                (<HTMLFormElement>this.getAll(".js_search-input")[1])[0]
            )).value.trim()
        );
    }

    set searchValue(value: string) {
        const search_forms = this.getAll(".js_search-input");
        search_forms.forEach((form) => {
            (<HTMLInputElement>(<HTMLFormElement>form)[0]).value = value;
        });
    }

    private bindEvents() {
        const search_forms = this.getAll(".js_search-input");
        search_forms.forEach((form) => {
            form.addEventListener("submit", (event) => {
                event.preventDefault();
                const query = this.searchValue;
                if (query.length > 2) {
                    this.searchValue = "";
                    this.events.notify({
                        type: UIEventType.NAVBAR_SEARCH_SUBMIT,
                        data: query,
                    });
                }
            });
        });
        this.element.querySelector("#logo")!.addEventListener("click", () => {
            this.events.notify({ type: UIEventType.NAVBAR_LOGO_CLICK });
        });
        this.element
            .querySelector("#address-button")!
            .addEventListener("click", () => {
                this.events.notify({ type: UIEventType.NAVBAR_ADDRESS_CLICK });
            });
        this.element.querySelector("#cart")!.addEventListener("click", () => {
            this.events.notify({ type: UIEventType.NAVBAR_CART_CLICK });
        });
        this.element
            .querySelector("#signin-button")!
            .addEventListener("click", () => {
                this.events.notify({ type: UIEventType.NAVBAR_SIGNIN_CLICK });
            });
        this.element.querySelector("#me")!.addEventListener("click", () => {
            this.events.notify({ type: UIEventType.NAVBAR_NAME_CLICK });
        });
        this.element
            .querySelector("#exit-button")!
            .addEventListener("click", () => {
                this.events.notify({ type: UIEventType.NAVBAR_EXIT_CLICK });
                controller.handleEvent({
                    type: VIEW_EVENT_TYPE.LOGOUT,
                    data: null,
                });
            });
    }

    updateCartIcon() {
        this.cartButton.querySelector("#sum")!.innerHTML =
            model.cartModel.getSumm() + "₽";
    }

    update(event?: UserEvent) {
        switch (event) {
            case UserEvent.USER_LOGIN: {
                const user = model.userModel.getUser();
                if (user) {
                    this.setAuthUser(user.Username);
                } else {
                    this.setNonAuthUser();
                }
                break;
            }
            case UserEvent.USER_LOGOUT: {
                const user = model.userModel.getUser();
                if (!user) {
                    this.setNonAuthUser();
                }
                break;
            }
            case UserEvent.ADDRESS_CHANGE: {
                const address = model.userModel.getAddress();
                this.element.querySelector(
                    ".navbar__fields__address__title",
                )!.innerHTML = address ? address : "Укажите адрес";
                break;
            }
            default:
                break;
        }
    }

    private setAuthUser(username: string) {
        this.userNameElement.firstElementChild!.innerHTML = username;
        this.element
            .querySelector(".navbar_main")!
            .appendChild(this.userNameElement);
        this.element
            .querySelector(".navbar__fields")!
            .appendChild(this.cartButton);
        this.updateCartIcon();
        if (this.signInButton.parentNode) {
            this.element
                .querySelector(".navbar_main")!
                .removeChild(this.signInButton);
        }
    }

    private setNonAuthUser() {
        this.element
            .querySelector(".navbar_main")!
            .appendChild(this.signInButton);
        if (this.userNameElement.parentNode) {
            this.element
                .querySelector(".navbar_main")!
                .removeChild(this.userNameElement);
        }
        if (this.cartButton.parentNode) {
            this.element
                .querySelector(".navbar__fields")!
                .removeChild(this.cartButton);
        }
    }

    load() {
        const user = model.userModel.getUser();
        if (user) this.setAuthUser(user!.Username);
    }
}
