import { Component, OnInit, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FavoriteProvider} from '../../providers/favorite/favorite';
import { Dish } from '../../shared/dish';
import { inject } from '../../../node_modules/@angular/core/src/render3';

/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage implements OnInit {

  favorites: Dish[];
  errorMess: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private favoriteservice: FavoriteProvider,
  @Inject('BaseURL') private BaseURL, 
  private tostController: ToastController,
  private loadingController: LoadingController,
  private alertController: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  ngOnInit() {
    this.favoriteservice.getFavorites()
    .subscribe(favorites => this.favorites = favorites,
    errmess => this.errorMess );
  }

  deleteFavorite(item: ItemSliding, id: number) {
    console.log('delete' + id);
    let alert = this.alertController.create({
      title: 'Confirm Title',
      message: 'do you want to delete '+ id,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('delete canceled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let loading = this.loadingController.create({
              content: 'Deleting ....'
            });
            let tost =  this.tostController.create({
              message: 'Dish ' + id + ' deleted successfully',
              duration: 3000
            });
            loading.present();
            this.favoriteservice.deleteFavorite(id)
            .subscribe(favorites => { this.favorites = favorites; loading.dismiss(), tost.present() },
            errmess => { this.errorMess = errmess; loading.dismiss(); });
          }
        }
      ]
    });
    alert.present();
    item.close();
  }
}
