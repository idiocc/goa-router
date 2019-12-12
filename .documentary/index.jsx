/**
 * The footer for documentation.
 */
export const footer = () => {
  const alt = 'idiocc'
  const src = 'https://avatars3.githubusercontent.com/u/38815725?v=4&s=100'
  const href = 'https://www.artd.eco'
  const org = 'Art Deco™'
  const year = new Date().getFullYear()
  return [
    (<table>
      <tr>
        <td>
          <img src={src} alt={alt} />
        </td>
        <td>
          © <a href={href}>{org}</a> {year}
        </td>
      </tr>
    </table>),
  ]
}