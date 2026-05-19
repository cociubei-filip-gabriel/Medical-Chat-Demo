using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using ChatMEDICAL.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatMEDICAL.Views
{
    public sealed partial class PatientDashboard : Page
    {
        private Dictionary<string, List<string>> doctorsBySpecialty =
            new Dictionary<string, List<string>>()
        {
            {
                "Cardiology",
                new List<string>
                {
                    "Dr. Andrei Popescu",
                    "Dr. Maria Ionescu",
                    "Dr. Radu Georgescu"
                }
            },

            {
                "Dermatology",
                new List<string>
                {
                    "Dr. Elena Marinescu",
                    "Dr. Sorin Dumitrescu",
                    "Dr. Bianca Pavel"
                }
            },

            {
                "Orthopedics",
                new List<string>
                {
                    "Dr. Cristian Toma",
                    "Dr. Diana Stoica",
                    "Dr. Vlad Rusu"
                }
            },

            {
                "Neurology",
                new List<string>
                {
                    "Dr. Ana Preda",
                    "Dr. Mihai Enache",
                    "Dr. Roxana Ilie"
                }
            },

            {
                "Pediatrics",
                new List<string>
                {
                    "Dr. Laura Matei",
                    "Dr. George Pavel",
                    "Dr. Simona Dobre"
                }
            },

            {
                "Gynecology",
                new List<string>
                {
                    "Dr. Cristina Neagu",
                    "Dr. Ioana Petrescu",
                    "Dr. Daniel Mureșan"
                }
            },

            {
                "Ophthalmology",
                new List<string>
                {
                    "Dr. Irina Stan",
                    "Dr. Paul Tudor",
                    "Dr. Silvia Matei"
                }
            },

            {
                "ENT",
                new List<string>
                {
                    "Dr. Cătălin Pop",
                    "Dr. Roxana Filip",
                    "Dr. Adrian Luca"
                }
            },

            {
                "Urology",
                new List<string>
                {
                    "Dr. Mihnea Roman",
                    "Dr. Oana Iliescu",
                    "Dr. Victor Stan"
                }
            },

            {
                "Gastroenterology",
                new List<string>
                {
                    "Dr. Claudia Pavel",
                    "Dr. Tudor Enescu",
                    "Dr. Silvia Barbu"
                }
            },

            {
                "Endocrinology",
                new List<string>
                {
                    "Dr. Monica Sandu",
                    "Dr. Raluca Dima",
                    "Dr. Adrian Nistor"
                }
            },

            {
                "Pulmonology",
                new List<string>
                {
                    "Dr. George Muntean",
                    "Dr. Larisa Popa",
                    "Dr. Mihai Dobre"
                }
            },

            {
                "Psychiatry",
                new List<string>
                {
                    "Dr. Sorina Matei",
                    "Dr. Alin Georgescu",
                    "Dr. Bianca Rusu"
                }
            },

            {
                "Oncology",
                new List<string>
                {
                    "Dr. Andrada Neagu",
                    "Dr. Paul Marinescu",
                    "Dr. Ruxandra Pop"
                }
            },

            {
                "General Surgery",
                new List<string>
                {
                    "Dr. Cristian Pavel",
                    "Dr. Mihnea Ionescu",
                    "Dr. Vlad Dumitru"
                }
            },

            {
                "Plastic Surgery",
                new List<string>
                {
                    "Dr. Ioana Luca",
                    "Dr. Robert Stan",
                    "Dr. Diana Popescu"
                }
            },

            {
                "Rheumatology",
                new List<string>
                {
                    "Dr. Elena Tudor",
                    "Dr. Sorin Pavel",
                    "Dr. Carmen Matei"
                }
            },

            {
                "Nephrology",
                new List<string>
                {
                    "Dr. Monica Radu",
                    "Dr. George Ilie",
                    "Dr. Silvia Dobre"
                }
            },

            {
                "Infectious Diseases",
                new List<string>
                {
                    "Dr. Andreea Pop",
                    "Dr. Vlad Marin",
                    "Dr. Roxana Toma"
                }
            },

            {
                "Diabetology",
                new List<string>
                {
                    "Dr. Ana Ionescu",
                    "Dr. Mihai Luca",
                    "Dr. Bianca Stoica"
                }
            },

            {
                "Family Medicine",
                new List<string>
                {
                    "Dr. Elena Popa",
                    "Dr. Radu Pavel",
                    "Dr. Cristina Dinu"
                }
            }
        };

        public PatientDashboard()
        {
            this.InitializeComponent();
            InitializeLocalSpecialties();
            Loaded += PatientDashboard_Loaded;
        }

        private void InitializeLocalSpecialties()
        {
            SpecialtyComboBox.Items.Clear();

            foreach (var specialty in doctorsBySpecialty.Keys.OrderBy(specialty => specialty))
            {
                SpecialtyComboBox.Items.Add(specialty);
            }

            if (SpecialtyComboBox.Items.Count > 0)
            {
                SpecialtyComboBox.SelectedIndex = 0;
                PopulateDoctorsFromLocalSpecialty(GetSelectedSpecialty());
            }
        }

        private async void PatientDashboard_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                var specialties = await MedicalApiClient.Shared.GetSpecialtiesAsync();

                if (specialties.Count == 0)
                    return;

                SpecialtyComboBox.Items.Clear();

                foreach (var specialty in specialties)
                {
                    SpecialtyComboBox.Items.Add(specialty);
                }

                if (SpecialtyComboBox.Items.Count > 0 && SpecialtyComboBox.SelectedItem == null)
                {
                    SpecialtyComboBox.SelectedIndex = 0;
                }

                await PopulateDoctorsAsync(GetSelectedSpecialty());
            }
            catch
            {
                // Keep the existing local list available when the API is not running.
                if (SpecialtyComboBox.Items.Count > 0 && SpecialtyComboBox.SelectedItem == null)
                {
                    SpecialtyComboBox.SelectedIndex = 0;
                }

                PopulateDoctorsFromLocalSpecialty(GetSelectedSpecialty());
            }
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(LoginPage));
        }

        private async void SpecialtyComboBox_SelectionChanged(
            object sender,
            SelectionChangedEventArgs e)
        {
            await PopulateDoctorsAsync(GetSelectedSpecialty());
        }

        private string GetSelectedSpecialty()
        {
            return SpecialtyComboBox.SelectedItem is ComboBoxItem selectedItem
                ? selectedItem.Content?.ToString() ?? ""
                : SpecialtyComboBox.SelectedItem?.ToString() ?? "";
        }

        private async Task PopulateDoctorsAsync(string specialty)
        {
            DoctorComboBox.Items.Clear();

            if (string.IsNullOrWhiteSpace(specialty))
                return;

            try
            {
                var doctors = await MedicalApiClient.Shared.GetDoctorsAsync(specialty);

                if (doctors.Count > 0)
                {
                    foreach (var doctor in doctors)
                    {
                        DoctorComboBox.Items.Add(doctor.Name);
                    }

                    DoctorComboBox.SelectedIndex = 0;
                    DoctorStatusText.Text = $"{DoctorComboBox.Items.Count} doctors loaded from API.";
                    return;
                }
            }
            catch
            {
                // Fall back to the local demo list if the API is not reachable.
            }

            PopulateDoctorsFromLocalSpecialty(specialty);
        }

        private void PopulateDoctorsFromLocalSpecialty(string specialty)
        {
            DoctorComboBox.Items.Clear();
            DoctorStatusText.Text = "";

            if (!doctorsBySpecialty.TryGetValue(specialty, out var doctors))
            {
                DoctorStatusText.Text = $"No local doctors found for '{specialty}'.";
                return;
            }

            foreach (var doctor in doctors)
            {
                DoctorComboBox.Items.Add(doctor);
            }

            DoctorComboBox.SelectedIndex = 0;
            DoctorStatusText.Text = $"{DoctorComboBox.Items.Count} doctors loaded.";
        }

        private async void BookAppointment_Click(object sender, RoutedEventArgs e)
        {
            if (SpecialtyComboBox.SelectedItem == null)
            {
                await ShowError("Please select a medical specialty.");
                return;
            }

            if (DoctorComboBox.SelectedItem == null)
            {
                await ShowError("Please select a doctor.");
                return;
            }

            DateTime selectedDate = AppointmentDatePicker.Date.Date;

            if (selectedDate < DateTime.Today)
            {
                await ShowError("You cannot select a past date.");
                return;
            }

            ContentDialog dialog = new ContentDialog
            {
                Title = "Appointment Request Sent",
                Content = "Your appointment request has been saved in the database. The doctor can now confirm it.",
                CloseButtonText = "Open Chat",
                XamlRoot = this.XamlRoot
            };

            if (DoctorComboBox.SelectedItem != null)
            {
                string doctorName = DoctorComboBox.SelectedItem.ToString() ?? "Assigned Doctor";
                string specialty = GetSelectedSpecialty();

                try
                {
                    await MedicalApiClient.Shared.CreateAppointmentAsync(
                        AppSession.PatientEmail,
                        doctorName,
                        specialty,
                        DateOnly.FromDateTime(selectedDate),
                        TimeOnly.FromTimeSpan(AppointmentTimePicker.Time),
                        "Appointment requested by patient");
                }
                catch (Exception ex)
                {
                    await ShowError($"Could not book the appointment through the API. {ex.Message}");
                    return;
                }

                await dialog.ShowAsync();

                Frame.Navigate(typeof(ChatPage), doctorName);
            }
        }

        private async Task ShowError(string message)
        {
            ContentDialog dialog = new ContentDialog
            {
                Title = "Validation Error",
                Content = message,
                CloseButtonText = "OK",
                XamlRoot = this.XamlRoot
            };

            await dialog.ShowAsync();
        }
        private void Profile_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(ProfilePage));
        }

        private void Prescription_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(PrescriptionPage));
        }

        private void History_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(AppointmentHistoryPage));
        }

        private void UploadFiles_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(UploadMedicalFilesPage));
        }

        private void OpenChat_Click(object sender, RoutedEventArgs e)
        {
            if (DoctorComboBox.SelectedItem != null)
            {
                string doctorName = DoctorComboBox.SelectedItem.ToString() ?? "Assigned Doctor";
                Frame.Navigate(typeof(ChatPage), doctorName);
            }
            else
            {
                _ = ShowError("Please select a doctor first.");
            }
        }
    }
}
