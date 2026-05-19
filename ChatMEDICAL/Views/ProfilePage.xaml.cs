using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace ChatMEDICAL.Views
{
    public sealed partial class ProfilePage : Page
    {
        public ProfilePage()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(PatientDashboard));
        }
    }
}