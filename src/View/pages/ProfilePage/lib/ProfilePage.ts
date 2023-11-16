import { UIEvent, UIEventType } from "../../../../config";
import { EventDispatcher, Listenable } from "../../../../modules/observer";
import { Page } from "../../../types";
import { AddressChooser } from "../../../widgets/AddressChooser";
import { Navbar } from "../../../widgets/Navbar";
import { OrderList } from "../../../widgets/OrderList";
import { ProfileWidget } from "../../../widgets/ProfileWidget";

import profilePageTemplate from "../ui/ProfilePage.hbs";
import "../ui/ProfilePage.scss";

export class ProfilePage extends Page implements Listenable<UIEvent> {
    private navbar: Navbar;
    private orderList: OrderList;
    private profile: ProfileWidget;
    private addressChooser: AddressChooser;

    private events_: EventDispatcher<UIEvent>;
    get events(): EventDispatcher<UIEvent> {
        return this.events_;
    }

    constructor() {
        super(profilePageTemplate(), "#profile_page");
        this.events_ = new EventDispatcher<UIEvent>();

        this.navbar = new Navbar();
        this.element.querySelector("#navbar")!.appendChild(this.navbar.element);
        this.navbar.events.subscribe(this.update.bind(this));

        this.profile = new ProfileWidget();
        this.element
            .querySelector(".profile__content__user-data")!
            .appendChild(this.profile.element);

        this.orderList = new OrderList();
        this.element
            .querySelector(".profile__content__orders")!
            .appendChild(this.orderList.element);

        this.addressChooser = new AddressChooser();
        this.element
            .querySelector("#address_chooser")!
            .appendChild(this.addressChooser.element);
    }

    update(event?: UIEvent) {
        console.log(event);
        if (event) {
            if (event.type == UIEventType.NAVBAR_ADDRESS_CLICK) {
                this.addressChooser.open();
            }
        }
        this.events.notify(event);
    }

    load() {
        this.navbar.load();
        this.profile.load();
        this.orderList.load();
    }
}
