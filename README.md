# TwitterLimiter

Twitterの閲覧時間を制限するGoogle Chromeの拡張機能です。

設定した時間内にTwitterから離れられなかった場合、設定したURLにリダイレクトさせることができます。

初期値として、閲覧時間は3分、リダイレクト先のURLは`https://www.google.com/`が設定されています。

## 設定方法

アイコンを右クリックするか、拡張機能一覧ページから詳細を表示をクリックしてオプションを開いてください。

Twitterの閲覧時間とリダイレクト先を変更できます。

TODOアプリなどのURLを設定するのがおすすめです。

## 仕様

Twitterのページを開いた時点でタイマーが開始されます。

タイマーが終了した場合、設定したURLにリダイレクトされます。（新しいタブで開きます）

再びTwitterに戻ると、タイマーが再開されます。

初めのページを開いた時点でタイマーが開始されるため、他のページを訪れて、タイマーの時間の直前にTwitterに戻ってくると、すぐにリダイレクトされます。

逆に、タイマーの時間直前に他のページを開いて、タイマーの時間を過ぎてからTwitterに戻ってくると、リダイレクトされません。

## ライセンス

MIT License
