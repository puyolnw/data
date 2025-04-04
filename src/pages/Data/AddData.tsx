import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Container,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  PersonOutline as ReceiverIcon,
  Note as NoteIcon,
  CheckCircleOutline as SuccessIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddData: React.FC = () => {
  const [formData, setFormData] = useState({
    document_name: '',
    sender_name: '',
    receiver_name: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [documentId, setDocumentId] = useState<string>('');
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.document_name || !formData.sender_name || !formData.receiver_name) {
      setError('กรุณากรอกชื่อเอกสาร, ผู้ส่ง และผู้รับ');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${apiUrl}/data`, formData);
      
      // เก็บ document_id ที่ได้จาก response
      setDocumentId(response.data.document_id || 'เอกสารใหม่');
      
      // แสดง dialog แจ้งความสำเร็จ
      setOpenSuccessDialog(true);
      setOpenSnackbar(true);
      
      // รีเซ็ตฟอร์ม
      setFormData({
        document_name: '',
        sender_name: '',
        receiver_name: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error creating document:', err);
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    // ไม่ต้อง navigate ทันที ให้ผู้ใช้เลือกเอง
  };

  const handleViewDocuments = () => {
    setOpenSuccessDialog(false);
    navigate('/data');
  };

  return (
    <Container maxWidth="md">
      <Fade in={true} timeout={800}>
        <Box sx={{ p: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/data"
            variant="outlined"
            sx={{ 
              mb: 3, 
              borderRadius: '8px',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateX(-5px)'
              }
            }}
          >
            กลับไปหน้ารายการเอกสาร
          </Button>

          <Card 
            elevation={3} 
            sx={{ 
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }
            }}
          >
            <CardHeader
              title={
                <Typography variant="h5" component="h2" fontWeight="600" color="--info">
                  เพิ่มเอกสารใหม่
                </Typography>
              }
              subheader="กรอกข้อมูลเอกสารที่ต้องการบันทึก"
              sx={{ 
                bgcolor: 'primary.light', 
                color: 'white',
                pb: 1
              }}
            />
            
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '8px',
                    animation: 'fadeIn 0.5s'
                  }}
                  onClose={() => setError(null)}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="ชื่อเอกสาร"
                      name="document_name"
                      value={formData.document_name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DescriptionIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.3)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ชื่อผู้ส่ง"
                      name="sender_name"
                      value={formData.sender_name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.3)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ชื่อผู้รับ"
                      name="receiver_name"
                      value={formData.receiver_name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ReceiverIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.3)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="หมายเหตุ (ถ้ามี)"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                            <NoteIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
                          },
                          '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(63, 81, 181, 0.3)'
                          }
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end',
                      mt: 2
                    }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                        size="large"
                        sx={{
                          borderRadius: '12px',
                          padding: '12px 24px',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(63, 81, 181, 0.2)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 16px rgba(63, 81, 181, 0.3)'
                          }
                        }}
                      >
                        บันทึกเอกสาร
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          pt: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <SuccessIcon 
            color="success" 
            sx={{ 
              fontSize: 80,
              mb: 2,
              animation: 'pulse 1.5s infinite'
            }} 
          />
          <Typography variant="h5" component="div" fontWeight="bold" color="success.main">
            บันทึกข้อมูลสำเร็จ!
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" align="center" paragraph>
            ระบบได้บันทึกเอกสารของคุณเรียบร้อยแล้ว
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            รหัสเอกสาร: <Typography component="span" fontWeight="bold" color="primary">{documentId}</Typography>
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            gap: 2,
            mt: 3,
            flexDirection: isMobile ? 'column' : 'row'
          }}>
            <Button
              variant="outlined"
              onClick={handleCloseSuccessDialog}
              sx={{ 
                borderRadius: '8px',
                minWidth: '120px'
              }}
            >
              เพิ่มเอกสารใหม่
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewDocuments}
              sx={{ 
                borderRadius: '8px',
                minWidth: '120px'
              }}
            >
              ดูรายการเอกสาร
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', borderRadius: '8px' }}
        >
          บันทึกเอกสารเรียบร้อยแล้ว
        </Alert>
      </Snackbar>

      {/* CSS Animation */}
    </Container>
  );
};

export default AddData;
