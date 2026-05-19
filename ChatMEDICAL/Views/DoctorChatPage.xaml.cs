// ===================================
// DoctorChatPage.xaml.cs (DOCTOR SIDE)
// ===================================

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;

namespace ChatMEDICAL.Views
{
    public sealed partial class DoctorChatPage : Page
    {
        public DoctorChatPage()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(LoginPage));
        }

        private void Send_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(MessageBox.Text))
                return;

            Border doctorMessage = new Border
            {
                Background = new Microsoft.UI.Xaml.Media.SolidColorBrush(
                    Microsoft.UI.Colors.White),
                CornerRadius = new CornerRadius(18),
                Padding = new Thickness(18),
                MaxWidth = 500,
                HorizontalAlignment = HorizontalAlignment.Left,
                BorderBrush = new Microsoft.UI.Xaml.Media.SolidColorBrush(
                    Microsoft.UI.ColorHelper.FromArgb(255, 220, 238, 255)),
                BorderThickness = new Thickness(1),
                Margin = new Thickness(0, 0, 0, 10)
            };

            StackPanel doctorStack = new StackPanel();

            TextBlock doctorText = new TextBlock
            {
                Text = MessageBox.Text,
                FontSize = 15,
                TextWrapping = TextWrapping.Wrap
            };

            TextBlock doctorTime = new TextBlock
            {
                Text = DateTime.Now.ToString("HH:mm"),
                FontSize = 12,
                HorizontalAlignment = HorizontalAlignment.Right
            };

            doctorStack.Children.Add(doctorText);
            doctorStack.Children.Add(doctorTime);

            doctorMessage.Child = doctorStack;
            MessagesPanel.Children.Add(doctorMessage);

            MessageBox.Text = "";
        }
    }
}