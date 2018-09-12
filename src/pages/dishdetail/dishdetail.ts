import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider} from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private favoriteservice: FavoriteProvider,
    private tostController: ToastController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private socialSharing: SocialSharing) {
      this.dish = navParams.get('dish');
      this.favorite = this.favoriteservice.idFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;
      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating );
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites:', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.tostController.create({
      message: 'Dish ' + this.dish.id + ' added as favorite succssfully',
      position: 'middle',
      duration: 3000
    }).present();
  }

  showActionSheet() {
    console.log('More button clicked');
    let actionSheet = this.actionSheetController.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            console.log('Add to Favorites clicked');
            this.addToFavorites();
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            console.log('Add Comment clicked');
            this.presentComment();
          }
        },
        {
          text: 'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Facebook'))
              .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Twitter'))
              .catch(() => console.log('Failed to post to Twitter'));
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();

  }

  presentComment() {
    let model = this.modalController.create(CommentPage);
    model.onDidDismiss(data => {
      if (data != null) {
        this.dish.comments.push(data);
      }
    });
    model.present();
  }
}
