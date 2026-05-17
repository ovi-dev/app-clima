import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async event => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}

/**
 * ExternalLink
 *
 * Wrapper sobre el componente `Link` de expo-router que abre URLs externas
 * en un navegador in-app (expo-web-browser) en iOS/Android, y en una pestaña
 * nueva en web.
 *
 * @example
 * <ExternalLink href="https://ejemplo.com">
 *   <Text>Abrir sitio</Text>
 * </ExternalLink>
 */
