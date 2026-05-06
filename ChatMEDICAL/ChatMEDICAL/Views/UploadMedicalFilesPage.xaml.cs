using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;

namespace ChatMEDICAL.Views
{
    public sealed partial class UploadMedicalFilesPage : Page
    {
        public UploadMedicalFilesPage()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(PatientDashboard));
        }
    }
}