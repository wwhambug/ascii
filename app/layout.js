export const metadata = {
  title: 'ASCII Tube',
  description: 'Youtube to ASCII Converter',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#000' }}>
        {children}
      </body>
    </html>
  );
}
