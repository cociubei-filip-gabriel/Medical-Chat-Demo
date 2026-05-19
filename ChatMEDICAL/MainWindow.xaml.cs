using Microsoft.UI.Xaml;
using ChatMEDICAL.Views;

namespace ChatMEDICAL
{
    public sealed partial class MainWindow : Window
    {
        public MainWindow()
        {
            this.InitializeComponent();

            MainFrame.Navigate(typeof(LoginPage));
        }
    }
}