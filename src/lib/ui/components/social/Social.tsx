import { Children, HTMLProps } from 'react'
import map from 'lodash/map'
import { appConfig, AppConfig, Social as SocialType } from '@/lib/config'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord, faGithub, faXTwitter } from '@fortawesome/free-brands-svg-icons'

export type SocialProps = HTMLProps<HTMLDivElement> & {
  include: Partial<AppConfig['social']>
}

export const Social = ({ include = {}, ...props }: SocialProps) => {
  return (
    <div {...props}>
      <ul className="flex gap-4 text-gray-400">
        {Children.toArray(
          map(Object.keys(include), (key: SocialType) => (
            <li>
              <a
                title={appConfig.social[key].label}
                href={appConfig.social[key].url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-600"
              >
                {
                  {
                    [SocialType.Discord]: (
                      <FontAwesomeIcon aria-hidden={true} width={20} height={20} icon={faDiscord} />
                    ),
                    [SocialType.Github]: (
                      <FontAwesomeIcon aria-hidden={true} width={20} height={20} icon={faGithub} />
                    ),
                    [SocialType.X]: (
                      <FontAwesomeIcon
                        aria-hidden={true}
                        width={20}
                        height={20}
                        icon={faXTwitter}
                      />
                    ),
                  }[key]
                }
              </a>
            </li>
          )),
        )}
      </ul>
    </div>
  )
}
export default Social
