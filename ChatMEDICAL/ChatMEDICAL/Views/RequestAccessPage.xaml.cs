using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;

namespace ChatMEDICAL.Views
{
    public sealed partial class RequestAccessPage : Page
    {
        public RequestAccessPage()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(LoginPage));
        }

        private async void SubmitRequest_Click(object sender, RoutedEventArgs e)
        {
            ContentDialog dialog = new ContentDialog
            {
                Title = "Request Submitted",
                Content = "Your access request has been sent successfully. Please wait for clinic approval.",
                CloseButtonText = "OK",
                XamlRoot = this.XamlRoot
            };

            await dialog.ShowAsync();

            Frame.Navigate(typeof(LoginPage));
        }
    }
}