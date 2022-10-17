import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getUserState, UserState } from '@eui/core';
import { Observable, Subscription } from 'rxjs';
import { I18nService } from '@eui/core';
import { LANG_PARAM_KEY } from '@eui/core';
import { HttpClient } from '@angular/common/http';
import { Portal, ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { UxDynamicComponentService } from '@eui/core';
import { UxDynamicModalConfig, UxDynamicModalService,UxDynamicModalComponent,} from '@eui/components/legacy/ux-dynamic-modal';
import { Inject } from '@angular/core';
import { DYNAMIC_COMPONENT_CONFIG } from '@eui/core';



@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
    userInfos: UserState;
    // Observe state changes
    userState: Observable<UserState>;
    // an array to keep all subscriptions and easily unsubscribe
    subs: Subscription[] = [];

    sidebarItems = [
        { label: 'Home', url: 'screen/home', iconClass: 'eui-icon-home' },
    ];
    notificationItems = [
        { label: 'Title label 1', subLabel: 'Subtitle label' },
        { label: 'Title label 2', subLabel: 'Subtitle label' },
        { label: 'Title label 3', subLabel: 'Subtitle label' },
        { label: 'Title label 4', subLabel: 'Subtitle label' },
    ];
    openModalData: any;
    closeModal: any;

    constructor(private store: Store<any>,protected i18nService: I18nService,protected http: HttpClient,private dynamicService: UxDynamicComponentService) {
        this.userState = <any>this.store.select(getUserState);
        this.subs.push(this.userState.subscribe((user: UserState) => {
            this.userInfos = { ...user };
        }));
        this.i18nService.init();
    }
    ngOnInit() {
        this.getByLang().subscribe((lang) => {
        });
        this.dynamicService.add(UxDynamicModalComponent, null,)

    }
    

    ngOnDestroy() {
        this.subs.forEach((s: Subscription) => s.unsubscribe());
    }
    getByLang(): Observable<any> {
        return this.http.get('/getByLanguage', { headers: {
            [LANG_PARAM_KEY]: 'lang',
        } })
    }
    openModal(config: UxDynamicModalConfig): any {

        let component;
    
        document.body.classList.add('modal-open');
    
        if (config instanceof UxDynamicModalConfig) {
            if (!(<UxDynamicModalConfig>config).onClose) {
                (<UxDynamicModalConfig>config).onClose = this.closeModal.bind(this);
            }
            component = UxDynamicModalComponent;
        } else {
            component = '';
        }
    
        this.openModalData = this.dynamicService.add(component, null, config);
        return this.openModalData;
    }

}
